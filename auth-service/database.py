from sqlmodel import SQLModel, create_engine, Session

DATABASE_URL = "postgresql://bhaktisn:IDRP_jnanasetu@postgres:5432/bhaktisn"
engine = create_engine(DATABASE_URL, echo=True)

def get_session():
    with Session(engine) as session:
        yield session 