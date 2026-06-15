import os
import json
from src.parser import LegalDocumentParser

def main():
    parser = LegalDocumentParser()
    raw_dir = os.path.join("data", "raw")
    processed_dir = os.path.join("data", "processed")
    
    os.makedirs(processed_dir, exist_ok=True)
    
    pdfs = [f for f in os.listdir(raw_dir) if f.endswith(".pdf")]
    
    for pdf in pdfs:
        pdf_path = os.path.join(raw_dir, pdf)
        print(f"Processing: {pdf_path}")
        
        try:
            pages = parser.parse_pdf(pdf_path)
            chunks = parser.chunk_document(pages)
            
            output_file = os.path.join(processed_dir, f"{os.path.splitext(pdf)[0]}_parsed.json")
            with open(output_file, "w", encoding="utf-8") as f:
                json.dump(chunks, f, indent=4)
                
            print(f"Saved {len(chunks)} chunks to {output_file}")
            
        except Exception as e:
            print(f"Error processing {pdf}: {e}")

if __name__ == "__main__":
    main()
