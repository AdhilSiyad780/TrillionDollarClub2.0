from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from app.core.config import settings

client: AsyncIOMotorClient = None
db: AsyncIOMotorDatabase = None


async def connect_db():
    global client, db
    client = AsyncIOMotorClient(settings.MONGODB_URL)   
    db = client[settings.MONGODB_DB_NAME]
    await db.users.create_index("supabase_user_id", unique=True)
    await db.users.create_index("email", unique=True)
    await db.products.create_index([("name", "text"), ("description", "text")])
    print("✅ Connected to MongoDB")


async def close_db():
    if client:
        client.close()


def get_db() -> AsyncIOMotorDatabase:
    return db