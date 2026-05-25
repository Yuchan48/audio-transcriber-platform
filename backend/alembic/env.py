import os
from logging.config import fileConfig
from sqlalchemy import engine_from_config, pool
from alembic import context

config = context.config

DATABASE_URL = os.getenv("DATABASE_URL")
if DATABASE_URL is None:

    raise ValueError("DATABASE_URL environment variable is not set")
config.set_main_option("sqlalchemy.url", DATABASE_URL)

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

from app.db.session import Base


def get_metadata():
    # Force import inside function
    import importlib

    importlib.import_module("app.models.models")

    # print("METADATA TABLES:", Base.metadata.tables.keys())

    return Base.metadata


def run_migrations_online():
    section = config.get_section(config.config_ini_section)

    if section is None:
        raise ValueError("Database URL not found in config file")
    connectable = engine_from_config(
        section,
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=get_metadata(),
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    raise Exception("Offline mode not supported")
else:
    run_migrations_online()
