CREATE TABLE readings (
    id           SERIAL PRIMARY KEY,
    device_id    VARCHAR(50) NOT NULL,
    metric       VARCHAR(50) NOT NULL,
    value        FLOAT NOT NULL,
    unit         VARCHAR(20),
    timestamp    TIMESTAMP DEFAULT NOW()
);