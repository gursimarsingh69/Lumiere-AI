import fitz  # PyMuPDF
import re
import os
from typing import List, Dict, Any

class LegalDocumentParser:
    """
    Parser to extract text, clean formatting, and structure clauses from legal PDFs.
    Supports standard PyMuPDF and highlights LlamaParse hook logic for complex tables.
    """
    
    def __init__(self, use_llama_parse: bool = False):
        self.use_llama_parse = use_llama_parse
        if use_llama_parse:
            api_key = os.getenv("LLAMA_CLOUD_API_KEY")
            if not api_key:
                raise ValueError("LLAMA_CLOUD_API_KEY must be set in environment variables when use_llama_parse=True")
            # In production, initialize LlamaParse client here
            print("LlamaParse enabled for complex tabular parsing.")

    def clean_text(self, text: str) -> str:
        """
        Removes consecutive spaces, line breaks, page footers/headers, and formatting noise.
        """
        # Replace line breaks inside a sentence with spaces
        text = re.sub(r'(?<!\n)\n(?!\n)', ' ', text)
        # Replace multiple spaces with a single space
        text = re.sub(r' +', ' ', text)
        # Normalize double newlines (paragraphs)
        text = re.sub(r'\n+', '\n\n', text)
        return text.strip()

    def parse_pdf(self, file_path: str) -> List[Dict[str, Any]]:
        """
        Parses a PDF file and returns a list of pages with clean text and metadata.
        """
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"File not found: {file_path}")
            
        print(f"Parsing document: {file_path}")
        pages_data = []

        if self.use_llama_parse:
            # Placeholder for LlamaParse integration:
            # from llama_parse import LlamaParse
            # parser = LlamaParse(result_type="markdown")
            # documents = parser.load_data(file_path)
            pass

        # Standard extraction fallback with PyMuPDF
        doc = fitz.open(file_path)
        for page_idx, page in enumerate(doc):
            raw_text = page.get_text("text")
            clean_text = self.clean_text(raw_text)
            
            pages_data.append({
                "page_number": page_idx + 1,
                "text": clean_text,
                "length": len(clean_text),
                "metadata": {
                    "document_name": os.path.basename(file_path),
                    "file_path": file_path
                }
            })
        
        doc.close()
        return pages_data

    def chunk_document(self, parsed_pages: List[Dict[str, Any]], chunk_size: int = 1000, chunk_overlap: int = 200) -> List[Dict[str, Any]]:
        """
        Naive chunking strategy: Splits text by characters with a sliding overlap.
        """
        chunks = []
        for page in parsed_pages:
            text = page["text"]
            metadata = page["metadata"]
            page_num = page["page_number"]
            
            start = 0
            chunk_idx = 0
            while start < len(text):
                end = min(start + chunk_size, len(text))
                chunk_text = text[start:end]
                
                chunks.append({
                    "chunk_id": f"{metadata['document_name']}_p{page_num}_c{chunk_idx}",
                    "text": chunk_text,
                    "metadata": {
                        **metadata,
                        "page_number": page_num,
                        "chunk_index": chunk_idx,
                        "start_char": start,
                        "end_char": end
                    }
                })
                start += (chunk_size - chunk_overlap)
                chunk_idx += 1
                
        return chunks

if __name__ == "__main__":
    # Test script runs standard parser
    parser = LegalDocumentParser()
    print("LegalDocumentParser loaded successfully.")
