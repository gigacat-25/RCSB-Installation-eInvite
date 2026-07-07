import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="relative min-h-screen w-screen bg-[#231815] flex items-center justify-center px-4 overflow-hidden">
      {/* Background glow to match theme */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#4A2E27]/30 blur-[120px]" />
      </div>

      <div className="relative z-10">
        <SignUp
          appearance={{
            variables: {
              colorPrimary: "#F5EFC8",
              colorBackground: "#231815",
              colorForeground: "#FFFFFF",
              colorMutedForeground: "#A5BCD6",
              colorInput: "transparent",
              colorInputForeground: "#F5EFC8",
              borderRadius: "12px",
            },
            elements: {
              cardBox: "shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] border border-[#F5EFC8]/12 bg-[#231815]/90 backdrop-blur-xl",
              headerTitle: "font-serif italic text-transparent-yellow text-2xl text-center",
              headerSubtitle: "text-xs font-sans font-light tracking-wide text-[#A5BCD6]/60 text-center",
              socialButtonsBlockButton: "border border-[#F5EFC8]/20 hover:bg-[#F5EFC8]/5 text-white transition-all text-xs uppercase tracking-wider font-sans font-light",
              dividerLine: "bg-[#F5EFC8]/10",
              dividerText: "text-[#A5BCD6]/40 text-[10px] uppercase tracking-widest",
              formFieldLabel: "text-[10px] uppercase tracking-[0.2em] font-sans font-light text-[#A5BCD6]/70",
              formFieldInput: "border-b border-[#F5EFC8]/20 focus:border-[#F5EFC8]/60 focus:ring-0 rounded-none bg-transparent py-2.5 px-0 text-sm font-sans font-light placeholder:text-white/10",
              formButtonPrimary: "rounded-full border border-[#F5EFC8]/45 bg-[#F5EFC8]/[0.05] hover:bg-[#F5EFC8]/[0.10] text-[#F5EFC8] hover:border-[#F5EFC8]/80 transition-all font-sans font-light uppercase text-xs tracking-widest shadow-none py-3",
              footerActionText: "text-[#A5BCD6]/60 text-xs font-sans font-light",
              footerActionLink: "text-[#F5EFC8] hover:text-[#F5EFC8]/80 text-xs font-sans font-medium transition-colors",
            },
          }}
        />
      </div>
    </div>
  );
}
