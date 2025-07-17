ALTER TABLE tags
ADD CONSTRAINT unique_tag_name UNIQUE (name, split_id);