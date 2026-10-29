"use client";

import { useState } from "react";
import {
  Wallet,
  CircleHelp,
  ArrowDownToLine,
  ArrowUpFromLine,
  ShieldCheck,
  ChevronDown,
  BookOpen,
  ArrowRight,
  MessageCircle,
  LockKeyhole,
} from "lucide-react";
import { faqData } from "../../../app/data/faq";

const categories = [
  "All topics",
  "Getting started",
  "Savings and deposits",
  "Withdrawals",
  "Wallet and security",
];

const faqs = faqData;

const Help = () => {
  const [activeCategory, setActiveCategory] = useState("All topics");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const filteredFaqs = faqs
    .map((faq, index) => ({ ...faq, index }))
    .filter(
      (faq) =>
        activeCategory === "All topics" || faq.category === activeCategory,
    );

  return (
    <div className="flex h-full min-h-0 flex-col gap-4 overflow-hidden rounded-2xl bg-[#f7f7f7] p-4">
      {/* Header: fixed height */}
      <div className="flex shrink-0 items-center justify-between gap-3">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight text-gray-950">
            Help Center
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Find answers and get the most out of CryptoJar.
          </p>
        </div>

        <div className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-gray-700 sm:flex">
          <CircleHelp size={23} />
        </div>
      </div>

      {/* Main content: fills remaining height */}
      <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 overflow-hidden xl:grid-cols-[minmax(0,1fr)_270px]">
        {/* FAQ panel */}
        <section className="flex min-h-0 min-w-0 flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white p-4 sm:p-5">
          {/* Fixed FAQ heading and filters */}
          <div className="flex shrink-0 flex-col gap-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-gray-950">
                  Frequently asked questions
                </h2>
                <p className="mt-1 text-xs text-gray-500">
                  Browse answers by topic
                </p>
              </div>

              <span className="shrink-0 rounded-lg bg-gray-100 px-2.5 py-1.5 text-xs font-medium text-gray-600">
                {filteredFaqs.length} questions
              </span>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => {
                    setActiveCategory(category);
                    setOpenFaq(null);
                  }}
                  className={`shrink-0 rounded-lg px-3 py-2 text-xs font-medium transition ${
                    activeCategory === category
                      ? "bg-gray-900 text-white"
                      : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* ONLY this FAQ list scrolls vertically */}
          <div className="mt-3 min-h-0 flex-1 overflow-y-auto overscroll-contain [scrollbar-gutter:stable]">
            {filteredFaqs.map((faq) => {
              const isOpen = openFaq === faq.index;

              return (
                <div
                  key={faq.question}
                  className="border-b border-gray-100 last:border-b-0"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : faq.index)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center gap-3 py-3 text-left"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-700">
                      <BookOpen size={17} />
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-medium leading-5 text-gray-900">
                        {faq.question}
                      </span>
                      <span className="mt-1 block text-xs text-gray-400">
                        {faq.category}
                      </span>
                    </span>

                    <ChevronDown
                      size={17}
                      className={`shrink-0 text-gray-500 transition-transform mr-3 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <p className="pb-4 pl-12 pr-3 text-sm leading-6 text-gray-600">
                      {faq.answer}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Right sidebar: no independent vertical scrolling */}
        <aside className="flex min-h-0 flex-col gap-4 overflow-hidden">
          {/* Quick guides */}
          <section className="shrink-0 rounded-2xl border border-gray-200 bg-white p-4">
            <h3 className="text-base font-semibold text-gray-950">
              Quick guides
            </h3>
            <p className="mt-1 text-xs leading-5 text-gray-500">
              Find your way around CryptoJar.
            </p>

            <div className="mt-3 flex flex-col gap-1">
              {[
                {
                  label: "Getting started",
                  category: "Getting started",
                  description: "Wallet and account basics",
                  icon: Wallet,
                },
                {
                  label: "Deposits and jars",
                  category: "Savings and deposits",
                  description: "Explore savings options",
                  icon: ArrowDownToLine,
                },
                {
                  label: "Withdrawals",
                  category: "Withdrawals",
                  description: "Access your saved funds",
                  icon: ArrowUpFromLine,
                },
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => {
                      setActiveCategory(item.category);
                      setOpenFaq(null);
                    }}
                    className="flex items-center gap-3 rounded-xl p-2 text-left transition hover:bg-gray-50"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-700">
                      <Icon size={17} />
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-medium text-gray-900">
                        {item.label}
                      </span>
                      <span className="mt-1 block text-xs text-gray-500">
                        {item.description}
                      </span>
                    </span>

                    <ArrowRight size={15} className="shrink-0 text-gray-400" />
                  </button>
                );
              })}
            </div>
          </section>

          {/* Security card */}
          <section className="shrink-0 rounded-2xl border border-gray-200 bg-white p-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-800">
                <ShieldCheck size={21} />
              </span>

              <div>
                <h3 className="text-sm font-semibold text-gray-950">
                  Stay protected
                </h3>
                <p className="mt-1 text-xs text-gray-500">
                  Keep your wallet secure.
                </p>
              </div>
            </div>

            <div className="mt-3 flex items-start gap-2 rounded-xl bg-gray-50 p-3">
              <LockKeyhole
                size={16}
                className="mt-0.5 shrink-0 text-gray-600"
              />
              <p className="text-xs leading-5 text-gray-600">
                Never share your recovery phrase or private key. Always review
                transactions before approving them.
              </p>
            </div>
          </section>

          {/* Support card fills the remaining height */}
          <div className="rounded-2xl bg-gray-900 p-5 text-white flex flex-col gap-4">
            <div>
              <div className="flex items-center gap-2">
                <MessageCircle size={19} />
                <h3 className="font-semibold">Still need help?</h3>
              </div>
              <p className="mt-2 text-sm leading-6 text-gray-300">
                If you cannot find an answer, contact the CryptoJar support team
                through email.
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.06] p-3">
              <p className="text-sm font-medium">A quick reminder</p>
              <p className="mt-1 text-xs leading-5 text-gray-300">
                CryptoJar support will never need your private key or recovery
                phrase to help troubleshoot a problem.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Help;
