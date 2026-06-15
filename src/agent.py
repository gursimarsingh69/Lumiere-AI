import os
from typing import Dict, Any, List, TypedDict, Literal
from dotenv import load_dotenv

load_dotenv()

# Define Agent State chart dictionary types
class DueDiligenceAgentState(TypedDict):
    document_paths: List[str]
    missing_clauses: List[Dict[str, Any]]
    contradictions: List[Dict[str, Any]]
    analysis_report: str
    current_step: str
    compliance_score: float

class LegalDueDiligenceAgent:
    """
    LangGraph-based AI agent to audit documents, perform cross-document checks,
    and proactively detect missing legal clauses (e.g. lack of non-competes, IP assignments).
    """
    
    def __init__(self):
        # In a complete implementation, link to LLM client (e.g. ChatOpenAI)
        self.openai_key = os.getenv("OPENAI_API_KEY")
        self.gemini_key = os.getenv("GEMINI_API_KEY")

    def audit_individual_document(self, state: DueDiligenceAgentState) -> Dict[str, Any]:
        """
        Scans a single contract and flags typical risks or absent items.
        """
        print(f"Auditing documents: {state['document_paths']}")
        # Simulated audit logic
        missing = []
        for path in state["document_paths"]:
            filename = os.path.basename(path).lower()
            if "employment" in filename:
                # Flag absent non-compete
                missing.append({
                    "document": os.path.basename(path),
                    "clause_category": "Restrictive Covenant",
                    "missing_clause": "Non-Compete Agreement",
                    "severity": "HIGH",
                    "reason": "Employment contract contains no post-termination non-compete clause, which is a standard safeguard."
                })
            elif "term_sheet" in filename:
                # Flag liquidation preference risks
                missing.append({
                    "document": os.path.basename(path),
                    "clause_category": "Liquidation Preference",
                    "missing_clause": "Participation Cap",
                    "severity": "HIGH",
                    "reason": "Liquidation preference is set to 3x but lacks an investor participation cap."
                })
        
        return {
            "missing_clauses": missing,
            "current_step": "cross_document_check"
        }

    def check_contradictions(self, state: DueDiligenceAgentState) -> Dict[str, Any]:
        """
        Verifies clauses between documents for conflicting statements (e.g. SHA vs NDA on IP).
        """
        print("Performing cross-document contradiction checks.")
        contradictions = []
        
        # Check if we have multiple documents to cross-analyze
        doc_names = [os.path.basename(p).lower() for p in state["document_paths"]]
        
        # Simulated cross-document conflict between SHA and NDA
        has_nda = any("nda" in name for name in doc_names)
        has_sha = any("term_sheet" in name or "sha" in name for name in doc_names)
        
        if has_nda and has_sha:
            contradictions.append({
                "severity": "HIGH",
                "clause_title": "IP Ownership Assignment",
                "detail": "Term Sheet/SHA Clause 14.1 refers to 'Company Intellectual Property' which conflicts with Mutual NDA Clause 6 defining all pre-existing designs as prior proprietary IP of the respective party."
            })
            
        return {
            "contradictions": contradictions,
            "current_step": "generate_report"
        }

    def generate_final_report(self, state: DueDiligenceAgentState) -> Dict[str, Any]:
        """
        Summarizes missing elements and conflicts, outputting a due diligence score.
        """
        print("Compiling due diligence report...")
        n_missing = len(state["missing_clauses"])
        n_conflicts = len(state["contradictions"])
        
        # Compute dynamic score
        score = 100.0 - (n_missing * 15) - (n_conflicts * 25)
        compliance_score = max(0.0, score)
        
        report = f"""
============================================================
LUMIÈREAI INDIA — DUE DILIGENCE AUDIT REPORT
============================================================
Documents Analyzed: {', '.join([os.path.basename(p) for p in state['document_paths']])}
Compliance Score: {compliance_score}%

MISSING CLAUSES IDENTIFIED:
{chr(10).join([f'- [{c["severity"]}] {c["missing_clause"]} in {c["document"]}: {c["reason"]}' for c in state["missing_clauses"]])}

CONTRADICTIONS IDENTIFIED:
{chr(10).join([f'- [{c["severity"]}] Conflict in {c["clause_title"]}: {c["detail"]}' for c in state["contradictions"]])}
============================================================
"""
        return {
            "analysis_report": report,
            "compliance_score": compliance_score,
            "current_step": "done"
        }

    def run_agent_loop(self, document_paths: List[str]) -> DueDiligenceAgentState:
        """
        Executes the LangGraph-style workflow steps sequentially.
        """
        # Initialize state
        state: DueDiligenceAgentState = {
            "document_paths": document_paths,
            "missing_clauses": [],
            "contradictions": [],
            "analysis_report": "",
            "current_step": "audit_individual",
            "compliance_score": 100.0
        }
        
        # Audit
        res = self.audit_individual_document(state)
        state["missing_clauses"] = res["missing_clauses"]
        state["current_step"] = res["current_step"]
        
        # Contradictions
        res = self.check_contradictions(state)
        state["contradictions"] = res["contradictions"]
        state["current_step"] = res["current_step"]
        
        # Report
        res = self.generate_final_report(state)
        state["analysis_report"] = res["analysis_report"]
        state["compliance_score"] = res["compliance_score"]
        state["current_step"] = res["current_step"]
        
        return state

if __name__ == "__main__":
    agent = LegalDueDiligenceAgent()
    print("LegalDueDiligenceAgent loaded successfully.")
