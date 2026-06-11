from pydantic import BaseModel

class TaskCreate(BaseModel):
    title: str
    description: str | None = None
    completed: bool = False
    priority: str = "medium"

class TaskResponse(TaskCreate):
    id: int

    class Config:
        from_attributes = True