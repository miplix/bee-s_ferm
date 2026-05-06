import { useState } from "react";
import { PixelButton } from "../shared/PixelButton";
import { useT } from "../../i18n/useT";

const WELCOME_KEY = "near-farm-welcome-v1";

export function useWelcomeShown() {
  return typeof localStorage !== "undefined"
    ? localStorage.getItem(WELCOME_KEY) === "1"
    : true;
}

export function WelcomeScreen() {
  const t = useT();
  const [step, setStep] = useState(0);
  const [dismissed, setDismissed] = useState(() =>
    typeof localStorage !== "undefined"
      ? localStorage.getItem(WELCOME_KEY) === "1"
      : true,
  );

  if (dismissed) return null;

  const steps = [
    { title: t("welcome.step1.title"), body: t("welcome.step1.desc") },
    { title: t("welcome.step2.title"), body: t("welcome.step2.desc") },
    { title: t("welcome.step3.title"), body: t("welcome.step3.desc") },
    { title: t("welcome.step4.title"), body: t("welcome.step4.desc") },
  ];

  const current = steps[step];
  const isLast = step === steps.length - 1;

  function dismiss() {
    localStorage.setItem(WELCOME_KEY, "1");
    setDismissed(true);
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70">
      <div className="bg-brown-700 border-2 border-yellow-600 p-5 max-w-[320px] w-full shadow-2xl">
        {/* Progress dots */}
        <div className="flex gap-1.5 mb-4 justify-center">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full border border-yellow-600 ${i === step ? "bg-yellow-400" : "bg-brown-600"}`}
            />
          ))}
        </div>

        <h2 className="font-game text-[10px] text-yellow-300 mb-3 text-center leading-tight">
          {current.title}
        </h2>
        <p className="font-game text-[8px] text-white/80 mb-5 text-center leading-relaxed">
          {current.body}
        </p>

        <div className="flex gap-2 justify-center">
          {!isLast ? (
            <>
              <PixelButton onClick={() => setStep((s) => s + 1)}>
                {t("welcome.continue")}
              </PixelButton>
              <PixelButton variant="secondary" onClick={dismiss}>
                {t("welcome.skip")}
              </PixelButton>
            </>
          ) : (
            <PixelButton onClick={dismiss}>
              {t("welcome.start")}
            </PixelButton>
          )}
        </div>
      </div>
    </div>
  );
}
