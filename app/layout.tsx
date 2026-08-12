import { 
  Cormorant, 
  Qwitcher_Grypen 
} from "next/font/google";
import "./globals.css";
import Header from "@/components/header";

// Fonts configure karein
const cormorant = Cormorant({ 
  subsets: ["latin"], 
  variable: "--font-cormorant",
  weight: ["300", "400", "500", "600", "700"]
});



const qwitcher = Qwitcher_Grypen({ 
  subsets: ["latin"], 
  variable: "--font-qwitcher", 
  weight: ["400", "700"] 
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* Sabhi font variables ko body par apply kar diya hai */}
      <body className={`
        ${cormorant.variable} 
        ${qwitcher.variable} 
        antialiased
      `}>
        <Header/>
        {children}
      </body>
    </html>
  );
}