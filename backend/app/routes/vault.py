import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User, VaultItem
from app.schemas import VaultItemCreate, VaultItemResponse
from app.security import get_current_user
from app.services import log_activity

router = APIRouter(prefix="/vault", tags=["Encrypted Vault"])

@router.get("", response_model=List[VaultItemResponse])
def get_vault_items(
    category: Optional[str] = Query(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(VaultItem).filter(VaultItem.user_id == current_user.id)
    if category and category != "All":
        query = query.filter(VaultItem.category == category)
    return query.order_by(VaultItem.last_accessed.desc()).all()

@router.post("", response_model=VaultItemResponse)
def add_vault_item(
    item_in: VaultItemCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    now = datetime.datetime.now(datetime.timezone.utc)
    item = VaultItem(
        user_id=current_user.id,
        name=item_in.name,
        category=item_in.category,
        is_encrypted=item_in.is_encrypted,
        encrypted_payload=item_in.encrypted_payload,
        iv=item_in.iv,
        auth_tag=item_in.auth_tag,
        metadata_json=item_in.metadata_json,
        created_at=now,
        last_accessed=now
    )
    db.add(item)
    db.commit()
    db.refresh(item)

    log_activity(db, current_user.id, "VAULT_ITEM_ADDED", f"Added encrypted vault item '{item_in.name}'.")
    return item

@router.get("/{item_id}", response_model=VaultItemResponse)
def get_vault_item(
    item_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    item = db.query(VaultItem).filter(
        VaultItem.id == item_id,
        VaultItem.user_id == current_user.id
    ).first()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Vault item not found.")

    item.last_accessed = datetime.datetime.now(datetime.timezone.utc)
    db.commit()

    log_activity(db, current_user.id, "VAULT_ACCESSED", f"Accessed encrypted vault item '{item.name}'.")
    return item

@router.delete("/{item_id}")
def delete_vault_item(
    item_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    item = db.query(VaultItem).filter(
        VaultItem.id == item_id,
        VaultItem.user_id == current_user.id
    ).first()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Vault item not found.")

    name = item.name
    db.delete(item)
    db.commit()

    log_activity(db, current_user.id, "VAULT_ITEM_DELETED", f"Deleted vault item '{name}'.")
    return {"message": "Vault item deleted successfully."}
