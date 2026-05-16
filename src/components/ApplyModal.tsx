"use client";
import { useState } from "react";
import { CheckCircle, X } from "lucide-react";

export default function ApplyModal({ title, company, onClose }: { title: string; company: string; onClose: () => void }) {
  const [step, setStep] = useState<"confirm" | "success">("confirm");

  const handleApply = () => {
    setTimeout(() => setStep("success"), 600);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full p-6 relative animate-in fade-in zoom-in-95 duration-200">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition">
          <X className="w-5 h-5" />
        </button>

        {step === "confirm" ? (
          <>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Postuler au stage</h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
              Vous allez envoyer votre candidature pour <span className="font-semibold text-gray-900 dark:text-white">{title}</span> chez{" "}
              <span className="font-semibold text-brand-600">{company}</span>.
            </p>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 mb-6 text-sm text-gray-600 dark:text-gray-400">
              <p className="font-medium text-gray-900 dark:text-white mb-1">Votre profil sera partagé :</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Nom et école</li>
                <li>Compétences techniques</li>
                <li>CV (PDF)</li>
                <li>LinkedIn & GitHub</li>
              </ul>
            </div>
            <div className="flex gap-3">
              <button onClick={onClose} className="flex-1 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition text-sm font-medium">
                Annuler
              </button>
              <button onClick={handleApply} className="flex-1 bg-brand-600 hover:bg-brand-700 text-white py-2.5 rounded-xl transition text-sm font-semibold">
                Confirmer la candidature
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-4">
            <div className="flex justify-center mb-4">
              <CheckCircle className="w-16 h-16 text-brand-500" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Candidature envoyée !</h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
              Votre candidature pour <span className="font-semibold text-gray-900 dark:text-white">{company}</span> a été transmise avec succès. Vous recevrez une réponse sous 5 à 10 jours ouvrables.
            </p>
            <button onClick={onClose} className="w-full bg-brand-600 hover:bg-brand-700 text-white py-2.5 rounded-xl transition text-sm font-semibold">
              Parfait, merci !
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
