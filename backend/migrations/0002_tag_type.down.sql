ALTER TABLE tags
ADD COLUMN is_custom BOOLEAN NOT NULL DEFAULT FALSE;

UPDATE tags
SET is_custom = TRUE
WHERE type = 'customtag';

UPDATE tags
SET is_custom = FALSE
WHERE type = 'alltag' OR type = 'usertag';

ALTER TABLE tags
DROP COLUMN type;

DROP TYPE tag_type;