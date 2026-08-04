UPDATE dayhome
SET location = ST_SetSRID(location, 4326)
WHERE ST_SRID(location) = 0;