import React, { useState } from "react";
import { useGame } from "../context/game-context";
import { useLanguage } from "../context/language-context";
import {
  ArrowLeft,
  Book,
  Sprout,
  ArrowDownRight,
  ArrowUpRight,
  Landmark,
  Tractor,
  History,
  Shield,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";
import { playSFX } from "../utils/fx-engine";

export const ReportsScreen = () => {
  const { state, dispatch } = useGame();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<"PASSBOOK" | "HARVESTS">(
    "PASSBOOK",
  );

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "FARMING":
        return <Sprout className="w-5 h-5 text-green-600" />;
      case "HARVEST":
        return <TrendingUp className="w-5 h-5 text-emerald-600" />;
      case "ASSET":
        return <Tractor className="w-5 h-5 text-orange-600" />;
      case "BANK":
        return <Landmark className="w-5 h-5 text-blue-600" />;
      case "EVENT":
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      default:
        return <Book className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-24">
      {/* Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800"></div>
        <div className="relative px-6 py-6 text-white">
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={() => {
                playSFX("click");
                dispatch({ type: "GO_TO_DASHBOARD" });
              }}
              className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl hover:bg-white/30 transition-all active:scale-95"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-semibold">{t("ui_back")}</span>
            </button>
          </div>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center ring-2 ring-white/30">
              <Book className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{t("rep_title")}</h2>
              <p className="text-sm text-blue-100 font-medium">
                {t("rep_subtitle")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Tabs */}
      <div className="relative z-10 px-4 -mt-6 mb-4">
        <div className="bg-white p-1.5 rounded-2xl shadow-lg border border-gray-100 flex items-center">
          <button
            onClick={() => {
              playSFX("click");
              setActiveTab("PASSBOOK");
            }}
            className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${activeTab === "PASSBOOK" ? "bg-blue-50 text-blue-700 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
          >
            <Book className="w-4 h-4" />
            {t("rep_tab_passbook")}
          </button>
          <button
            onClick={() => {
              playSFX("click");
              setActiveTab("HARVESTS");
            }}
            className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${activeTab === "HARVESTS" ? "bg-blue-50 text-blue-700 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
          >
            <History className="w-4 h-4" />
            {t("rep_tab_harvests")}
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 px-4 overflow-y-auto space-y-3 pb-10">
        {/* TAB 1: PASSBOOK LEDGER */}
        {activeTab === "PASSBOOK" && (
          <>
            {!state.transactions || state.transactions.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-3xl border border-gray-100 shadow-sm">
                <Book className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">{t("rep_no_tx")}</p>
              </div>
            ) : (
              state.transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center justify-between animate-fade-in"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${tx.type === "INCOME" ? "bg-emerald-50" : "bg-red-50"}`}
                    >
                      {getCategoryIcon(tx.category)}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 leading-tight mb-1">
                        {t(tx.descKey)}
                      </h4>
                      <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        {t("season")} {tx.season} •{" "}
                        {t(`tx_cat_${tx.category.toLowerCase()}`)}
                      </div>
                    </div>
                  </div>
                  <div
                    className={`font-bold font-mono text-lg ${tx.type === "INCOME" ? "text-emerald-600" : "text-red-600"}`}
                  >
                    {tx.type === "INCOME" ? "+" : "-"}₹
                    {tx.amount.toLocaleString('en-IN')}
                  </div>
                </div>
              ))
            )}
          </>
        )}

        {/* TAB 2: HARVEST HISTORY */}
        {activeTab === "HARVESTS" && (
          <>
            {!state.history || state.history.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-3xl border border-gray-100 shadow-sm">
                <Sprout className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">
                  {t("reports_empty")}
                </p>
              </div>
            ) : (
              state.history.map((record, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in"
                >
                  <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-4 text-white">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center font-bold">
                          {record.season}
                        </div>
                        <div>
                          <span className="text-sm font-semibold opacity-90 uppercase tracking-wider block">
                            {t("season")} {record.season}
                          </span>
                          <span className="text-xs opacity-80">Completed</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold font-mono">
                          ₹{record.income.toLocaleString('en-IN')}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Shield className="w-4 h-4" />
                        <span className="text-sm font-medium">
                          {t("profile_resilience")}
                        </span>
                      </div>
                      <span className="font-bold text-green-700 text-lg">
                        {record.resilience}/100
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </>
        )}
      </div>
    </div>
  );
};
