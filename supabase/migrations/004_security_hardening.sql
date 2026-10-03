-- Add length constraints that the DB enforces regardless of client-side maxLength.
ALTER TABLE readings
  ADD CONSTRAINT readings_notes_length CHECK (char_length(notes) <= 1000);

ALTER TABLE profiles
  ADD CONSTRAINT profiles_display_name_length CHECK (char_length(display_name) <= 100);
