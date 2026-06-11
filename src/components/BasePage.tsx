import { Outlet } from "react-router-dom";

import Header from "./Header";


function BasePage() {

    return (
        <div className="min-h-dvh bg-[#FCFCFC] text-[#1D1617]">
            <Header />

            <main className="mx-auto max-w-[1180px] px-4 py-8 sm:px-6 lg:px-8">
                <div className="rounded-[28px] bg-white p-4 shadow-[0_12px_40px_rgba(29,22,23,0.05)] sm:p-6 lg:p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}

export default BasePage;