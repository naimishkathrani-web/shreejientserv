-- Create storage bucket for rider documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('rider-documents', 'rider-documents', false)
ON CONFLICT (id) DO NOTHING;

-- Policy to allow authenticated uploads
CREATE POLICY "Authenticated users can upload documents"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'rider-documents' AND
  auth.role() = 'authenticated'
);

-- Policy to allow users to view their own documents
CREATE POLICY "Users can view own documents"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'rider-documents' AND
  auth.uid() = owner
);
