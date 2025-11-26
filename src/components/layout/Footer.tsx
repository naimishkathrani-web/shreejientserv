"use client";

import React from 'react';
import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-white py-6 mt-auto border-t border-purple-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="text-sm font-medium text-purple-100">
                        Shreeji Enterprise Services
                    </div>

                    <ul className="flex flex-wrap justify-center gap-6 text-xs text-gray-400">
                        <li><Link href="/#home" className="hover:text-purple-400 transition-colors">Home</Link></li>
                        <li><Link href="/#about" className="hover:text-purple-400 transition-colors">About</Link></li>
                        <li><Link href="/#services" className="hover:text-purple-400 transition-colors">Services</Link></li>
                        <li><Link href="/contract" className="hover:text-purple-400 transition-colors">Rider Agreement</Link></li>
                        <li><Link href="/#contact" className="hover:text-purple-400 transition-colors">Contact</Link></li>
                    </ul>

                    <div className="text-xs text-gray-500">
                        © {new Date().getFullYear()} All rights reserved
                    </div>
                </div>
            </div>
        </footer>
    );
}
