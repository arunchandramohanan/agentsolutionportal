from pydantic import BaseModel


class Curator(BaseModel):
    name: str
    role: str


class Solution(BaseModel):
    id: str
    title: str
    tagline: str
    description: str
    industry: str
    industries: list[str]
    stack: list[str]
    type: str
    status: str
    team: str
    placeholderTone: str = "default"
    placeholderLabel: str = ""
    featured: bool = False
    imageUrl: str = ""


class Collection(BaseModel):
    id: str
    title: str
    pitch: str
    curator: Curator
    tone: str = "default"
    label: str = ""
    solutionIds: list[str]
    tags: list[str]
    imageUrl: str = ""


class IndustryCount(BaseModel):
    id: str
    count: int


class StackCount(BaseModel):
    id: str
    count: int


class Submission(BaseModel):
    title: str
    tagline: str
    description: str
    industries: list[str]
    stack: str
    type: str
    repo: str = ""
    demo: str = ""
