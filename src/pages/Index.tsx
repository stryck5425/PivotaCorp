import React from 'react';
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import TermsAndConditions from "@/components/TermsAndConditions";
import { useTermsScroll } from "@/hooks/useTermsScroll";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from '@/lib/utils';

const Index = () => {
  const { currentSessionStats, personalRecordStats, resetSession } = useTermsScroll();
  const [isSheetOpen, setIsSheetOpen] = React.useState(false); // For mobile sidebar
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = React.useState(true); // For desktop sidebar

  const toggleDesktopSidebar = () => {
    setIsDesktopSidebarOpen(prev => !prev);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header
        companyName="SynergyCorp™"
        tagline="Innovating Tomorrow's Solutions, Today. (Terms Apply. Always.)"
        onMenuClick={() => setIsSheetOpen(true)} // Open sheet on mobile menu click
        onToggleSidebar={toggleDesktopSidebar} // Toggle desktop sidebar
        isSidebarOpen={isDesktopSidebarOpen} // Pass state to Header for icon
      />
      <div className="flex flex-1">
        {/* Desktop Sidebar */}
        <Sidebar
          currentSessionStats={currentSessionStats}
          personalRecordStats={personalRecordStats}
          onResetSession={resetSession}
          className={cn(
            "hidden", // Hidden by default on all screens
            isDesktopSidebarOpen ? "lg:block w-64" : "lg:w-0 lg:overflow-hidden" // Show/hide on lg and above with dynamic width
          )}
          style={{ transition: 'width 0.3s ease-in-out' }} // Smooth transition for width
        />

        {/* Mobile Sidebar (Sheet) */}
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild className="hidden">
            {/* This trigger is hidden, the Header button will open the sheet */}
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            <Sidebar
              currentSessionStats={currentSessionStats}
              personalRecordStats={personalRecordStats}
              onResetSession={() => {
                resetSession();
                setIsSheetOpen(false); // Close sheet after reset
              }}
              className="w-full h-full border-none" // Adjust styling for sheet content
            />
          </SheetContent>
        </Sheet>

        <TermsAndConditions className="flex-1" />
      </div>
    </div>
  );
};

export default Index;