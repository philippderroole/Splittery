CREATE TYPE tag_type AS ENUM ('alltag', 'usertag', 'customtag');

ALTER TABLE tags
ADD COLUMN type tag_type NOT NULL DEFAULT 'usertag';

UPDATE tags
SET type = 'customtag'
WHERE is_custom = true;

UPDATE tags
SET type = 'alltag'
WHERE name = 'all';

ALTER TABLE tags
DROP COLUMN is_custom;