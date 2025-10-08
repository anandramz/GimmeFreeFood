'use client';

import { useForm, SubmitHandler } from 'react-hook-form';
import { useState } from 'react';

interface IFormInput {
  freeFood: boolean;
  merch: boolean;
  credit: boolean;
}

export default function PreferencesPage() {
  const { register, handleSubmit, watch } = useForm<IFormInput>({
    defaultValues: {
      freeFood: true,
      merch: true,
      credit: true
    }
  });
  const [saved, setSaved] = useState(false);

  const selectedPreferences = watch();
  const selectedCount = Object.values(selectedPreferences).filter(Boolean).length;

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    console.log('Preferences:', data);
    // Here you would typically send the data to your backend API
    // await fetch('/api/preferences', { method: 'POST', body: JSON.stringify(data) });
    
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl shadow-lg mb-4">
            <h1 className="text-3xl md:text-4xl font-bold">⚙️ Your Preferences</h1>
          </div>
          <p className="text-gray-600 text-lg">
            Choose what you want to be notified about
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-blue-200 overflow-hidden">
          {/* Progress Indicator */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4 text-white">
            <div className="flex items-center justify-between">
              <span className="font-semibold">Selected: {selectedCount} of 3</span>
              <span className="text-sm opacity-90">📧 Daily emails at 8:00 AM</span>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-8">
            <div className="space-y-6">
              {/* Free Food Option */}
              <label 
                htmlFor="freeFood"
                className="flex items-start p-6 rounded-xl border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all cursor-pointer group"
              >
                <input
                  id="freeFood"
                  type="checkbox"
                  {...register('freeFood')}
                  className="mt-1 h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                />
                <div className="ml-4 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-3xl">🍔</span>
                    <span className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                      Free Food
                    </span>
                  </div>
                  <p className="text-gray-600 mt-2">
                    Get notified about events offering free meals, snacks, pizza, and refreshments. Never miss a free lunch!
                  </p>
                </div>
              </label>

              {/* Free Merch Option */}
              <label 
                htmlFor="merch"
                className="flex items-start p-6 rounded-xl border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all cursor-pointer group"
              >
                <input
                  id="merch"
                  type="checkbox"
                  {...register('merch')}
                  className="mt-1 h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                />
                <div className="ml-4 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-3xl">👕</span>
                    <span className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                      Free Merchandise
                    </span>
                  </div>
                  <p className="text-gray-600 mt-2">
                    Score free t-shirts, stickers, water bottles, and other swag from campus organizations and events.
                  </p>
                </div>
              </label>

              {/* Credit Option */}
              <label 
                htmlFor="credit"
                className="flex items-start p-6 rounded-xl border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all cursor-pointer group"
              >
                <input
                  id="credit"
                  type="checkbox"
                  {...register('credit')}
                  className="mt-1 h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                />
                <div className="ml-4 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-3xl">🎟️</span>
                    <span className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                      Course Credit & Vouchers
                    </span>
                  </div>
                  <p className="text-gray-600 mt-2">
                    Find events that offer academic credit, gift cards, vouchers, and other valuable incentives.
                  </p>
                </div>
              </label>
            </div>

            {/* Info Box */}
            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">💡</span>
                <div className="flex-1">
                  <p className="text-sm text-gray-700">
                    <strong>Pro Tip:</strong> Select all three to maximize your opportunities! 
                    You&apos;ll receive one consolidated email each morning with all matching events.
                  </p>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="mt-8 space-y-4">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-blue-300"
              >
                {saved ? '✓ Preferences Saved!' : 'Save Preferences'}
              </button>

              {saved && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                  <p className="text-green-700 font-semibold">
                    ✓ Your preferences have been updated successfully!
                  </p>
                </div>
              )}
            </div>
          </form>

          {/* Footer */}
          <div className="bg-gray-50 px-8 py-6 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <a href="/" className="text-blue-600 hover:text-blue-700 font-medium hover:underline">
              ← Back to Home
            </a>
            <a href="/auth/logout" className="text-red-600 hover:text-red-700 font-medium hover:underline">
              Log Out →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
