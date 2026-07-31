import React, { useState, useEffect, useRef } from 'react';
import { GrammarIssue, GrammarCheckResult } from '../types';
import { CheckCircle2, AlertCircle, Wand2, Sparkles, ChevronDown, ChevronUp, RefreshCw, Check } from 'lucide-react';

interface VerifiedFieldProps {
  value: string;
  onChange: (newValue: string) => void;
  fieldName: string;
  isTextArea?: boolean;
  rows?: number;
  placeholder?: string;
  className?: string;
  label?: string;
  required?: boolean;
}

export const VerifiedField: React.FC<VerifiedFieldProps> = ({
  value,
  onChange,
  fieldName,
  isTextArea = false,
  rows = 3,
  placeholder,
  className = '',
  label,
  required = false
}) => {
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState<GrammarCheckResult | null>(null);
  const [showPopover, setShowPopover] = useState(false);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  const checkGrammar = async (textToCheck: string) => {
    if (!textToCheck || textToCheck.trim().length < 3) {
      setResult(null);
      setIsChecking(false);
      return;
    }

    setIsChecking(true);
    try {
      const res = await fetch('/api/ai/grammar-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textToCheck, fieldName })
      });
      const data: GrammarCheckResult = await res.json();
      setResult(data);
    } catch (err) {
      console.error('Error running grammar check:', err);
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    if (value && value.trim().length >= 3) {
      setIsChecking(true);
      debounceTimer.current = setTimeout(() => {
        checkGrammar(value);
      }, 700);
    } else {
      setResult(null);
      setIsChecking(false);
    }

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [value]);

  const handleApplySingleCorrection = (issue: GrammarIssue) => {
    if (!issue.errorWord || !issue.suggestion) return;
    const regex = new RegExp(issue.errorWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    const updated = value.replace(regex, issue.suggestion);
    onChange(updated);
    
    // Remove fixed issue from local result state
    if (result) {
      const updatedIssues = result.issues.filter(i => i.id !== issue.id);
      setResult({
        ...result,
        issues: updatedIssues,
        score: Math.min(100, result.score + 10)
      });
      if (updatedIssues.length === 0) {
        setShowPopover(false);
      }
    }
  };

  const handleApplyAllCorrections = () => {
    if (result && result.correctedText) {
      onChange(result.correctedText);
      setResult({
        ...result,
        issues: [],
        score: 100
      });
      setShowPopover(false);
    }
  };

  const issuesCount = result?.issues?.length || 0;

  return (
    <div className="flex flex-col gap-1.5 relative w-full font-sans">
      {label && (
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-[#434655] uppercase flex items-center gap-1">
            <span>{label}</span>
            {required && <span className="text-[#ba1a1a]">*</span>}
          </label>

          {/* Grammar Status Badge */}
          <div className="flex items-center gap-1.5 text-xs">
            {isChecking ? (
              <span className="flex items-center gap-1 text-[#004ac6] bg-[#2563eb]/10 px-2 py-0.5 rounded-full text-[11px] font-semibold animate-pulse">
                <RefreshCw className="w-3 h-3 animate-spin" />
                <span>Verificando...</span>
              </span>
            ) : issuesCount > 0 ? (
              <button
                type="button"
                onClick={() => setShowPopover(!showPopover)}
                className="flex items-center gap-1 bg-[#ffdad6] hover:bg-[#ffb4ab] text-[#8c0009] px-2.5 py-0.5 rounded-full text-[11px] font-bold transition-all cursor-pointer shadow-xs border border-[#ba1a1a]/20"
              >
                <AlertCircle className="w-3.5 h-3.5 text-[#ba1a1a]" />
                <span>{issuesCount} {issuesCount === 1 ? 'sugestão' : 'sugestões'}</span>
                {showPopover ? <ChevronUp className="w-3 h-3 ml-0.5" /> : <ChevronDown className="w-3 h-3 ml-0.5" />}
              </button>
            ) : value && value.trim().length >= 3 && result ? (
              <span className="flex items-center gap-1 text-[#006e1c] bg-[#d4eabb] px-2 py-0.5 rounded-full text-[11px] font-semibold">
                <CheckCircle2 className="w-3 h-3 text-[#006e1c]" />
                <span>Gramática OK</span>
              </span>
            ) : null}
          </div>
        </div>
      )}

      {/* Input or Textarea container */}
      <div className="relative w-full">
        {isTextArea ? (
          <textarea
            rows={rows}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={`w-full p-3.5 rounded-xl border text-sm text-[#191c1e] focus:outline-none transition-all leading-relaxed ${
              issuesCount > 0
                ? 'border-[#ba1a1a]/60 bg-[#fff8f7] focus:border-[#ba1a1a] focus:ring-1 focus:ring-[#ba1a1a]/30'
                : 'border-[#c3c6d7] focus:border-[#2563eb]'
            } ${className}`}
          />
        ) : (
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={`w-full h-11 px-3.5 rounded-xl border text-sm text-[#191c1e] focus:outline-none transition-all ${
              issuesCount > 0
                ? 'border-[#ba1a1a]/60 bg-[#fff8f7] focus:border-[#ba1a1a] focus:ring-1 focus:ring-[#ba1a1a]/30'
                : 'border-[#c3c6d7] focus:border-[#2563eb]'
            } ${className}`}
          />
        )}

        {!label && (
          <div className="absolute right-2.5 top-2.5 flex items-center gap-1">
            {isChecking ? (
              <RefreshCw className="w-4 h-4 text-[#2563eb] animate-spin" />
            ) : issuesCount > 0 ? (
              <button
                type="button"
                onClick={() => setShowPopover(!showPopover)}
                className="bg-[#ba1a1a] text-white p-1 rounded-full text-xs font-bold shadow-xs hover:bg-[#93000a] transition-all cursor-pointer"
                title={`${issuesCount} erro(s) ortográficos/gramaticais`}
              >
                <AlertCircle className="w-3.5 h-3.5" />
              </button>
            ) : value && value.trim().length >= 3 && result ? (
              <CheckCircle2 className="w-4 h-4 text-[#006e1c]" />
            ) : null}
          </div>
        )}
      </div>

      {/* Popover / Suggestions Panel */}
      {showPopover && result && issuesCount > 0 && (
        <div className="z-20 mt-1 p-3.5 bg-white border border-[#ffb4ab] rounded-xl shadow-lg flex flex-col gap-3 animate-in fade-in slide-in-from-top-1 duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-[#f2f4f6]">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#ba1a1a]">
              <Sparkles className="w-4 h-4 text-[#2563eb]" />
              <span>Correções Ortográficas & Gramaticais ({fieldName})</span>
            </div>
            <button
              type="button"
              onClick={handleApplyAllCorrections}
              className="bg-[#004ac6] hover:bg-[#2563eb] text-white px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer shadow-xs"
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span>Corrigir Tudo</span>
            </button>
          </div>

          <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-1">
            {result.issues.map((issue) => (
              <div
                key={issue.id}
                className="p-2.5 rounded-lg bg-[#fff8f7] border border-[#ffdad6] flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-2">
                    <span className="line-through text-[#ba1a1a] font-semibold text-xs bg-[#ffdad6]/50 px-1.5 py-0.5 rounded">
                      {issue.errorWord}
                    </span>
                    <span className="text-xs text-[#737686]">→</span>
                    <span className="text-[#006e1c] font-bold text-xs bg-[#d4eabb]/60 px-1.5 py-0.5 rounded">
                      {issue.suggestion}
                    </span>
                  </div>
                  <span className="text-[11px] text-[#434655]">{issue.message}</span>
                </div>

                <button
                  type="button"
                  onClick={() => handleApplySingleCorrection(issue)}
                  className="self-end sm:self-center bg-white hover:bg-[#d4eabb] text-[#006e1c] border border-[#006e1c]/40 hover:border-[#006e1c] px-2.5 py-1 rounded-md text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shadow-2xs"
                >
                  <Check className="w-3 h-3" />
                  <span>Aplicar</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

interface FullGrammarToolbarProps {
  onCheckFullResume: () => void;
  totalIssuesCount: number;
  isAnalyzing: boolean;
  onFixAllFields: () => void;
}

export const FullGrammarToolbar: React.FC<FullGrammarToolbarProps> = ({
  onCheckFullResume,
  totalIssuesCount,
  isAnalyzing,
  onFixAllFields
}) => {
  return (
    <div className="bg-gradient-to-r from-[#2563eb]/10 via-[#004ac6]/5 to-white p-4 rounded-2xl border border-[#2563eb]/20 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-[#2563eb] text-white rounded-xl shadow-xs">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h4 className="font-bold text-sm text-[#191c1e] flex items-center gap-2">
            <span>Verificador Ortográfico & Gramatical em Tempo Real</span>
            <span className="bg-[#2563eb]/15 text-[#004ac6] text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full">
              IA Gemini
            </span>
          </h4>
          <p className="text-xs text-[#434655]">
            Destaca e corrige erros de digitação, concordância e acentuação nos campos do seu currículo.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
        {totalIssuesCount > 0 && (
          <button
            type="button"
            onClick={onFixAllFields}
            className="bg-[#004ac6] hover:bg-[#2563eb] text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95"
          >
            <Wand2 className="w-4 h-4" />
            <span>Corrigir Todos ({totalIssuesCount})</span>
          </button>
        )}

        <button
          type="button"
          onClick={onCheckFullResume}
          disabled={isAnalyzing}
          className="bg-white hover:bg-[#f2f4f6] text-[#191c1e] border border-[#c3c6d7] px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin text-[#2563eb]' : ''}`} />
          <span>{isAnalyzing ? 'Analisando...' : 'Revisar Currículo'}</span>
        </button>
      </div>
    </div>
  );
};
