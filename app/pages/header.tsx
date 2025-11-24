'use client';

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useTheme } from "next-themes";

export default function Header() {
  
     useEffect(() => {
       const channel = new BroadcastChannel("tabs");
      console.log('channel',channel)
      const handleKeyDown = (e: KeyboardEvent) => {
        // Check for Ctrl+P (Windows/Linux) or Cmd+P (Mac)
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') {
          e.preventDefault(); // Stop the print dialog
          toast.error("you cannot print this page!");
          setTimeout(() => {
            toast.dismiss();
          }, 1000);
        }
        else if (e.key === 'PrintScreen' || 
        (e.ctrlKey && ['s', 'p', 'c'].includes(e.key.toLowerCase()))) {
          e.preventDefault(); // Stop the print dialog
          toast.error("you cannot Screen Shot Of this page!");
          setTimeout(() => {
            toast.dismiss();
          }, 1000);
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        window.removeEventListener("keydown", handleKeyDown);
      };
    }, []);
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  console.log('pathname',pathname);
  const [loading, setLoading] = useState(false);
  const [navList, setNavList] = useState([
    { name: "Home", href: "/", isActive: false },
    { name: "About", href: "/about", isActive: false },
    { name: "Contact", href: "/contact", isActive: false },
    { name: "Blogs", href: "/blog", isActive: false },
  ]);
  const [mounted, setMounted] = useState(false);
  // Update active nav item whenever path changes.
  // If the current pathname doesn't match any nav item, mark Home active and
  // replace the URL to `/` (client-side) to avoid navigation loops.
  useEffect(() => {
    // Compute updated nav list based on pathname
    const updated = navList.map((item:any) => ({ ...item, isActive: item.href === pathname }));
    const hasActive = updated.some((i:any) => i.isActive);

    if (!hasActive) {
      // Only navigate on the client and only if we're not already at '/'
      if (typeof window !== 'undefined' && pathname !== '/') {
        router.replace('/');
      }
      // Ensure Home is marked active in the UI state
      setNavList(updated.map((i:any) => ({ ...i, isActive: i.href === '/' })));
      return;
    }

    setNavList(updated);
  }, [pathname, router]);

  // Track client mount to avoid rendering client-only attributes during SSR
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle browser back/forward buttons safely
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handlePopState = () => {
      const currentPath = window.location?.pathname ?? pathname;
      setNavList(prev =>
        prev.map(item => ({
          ...item,
          isActive: item.href === currentPath
        }))
      );
    };

    window.addEventListener('popstate', handlePopState);

    return () => window.removeEventListener('popstate', handlePopState);
  }, [pathname]);

  // Optional: load Bootstrap JS on client
  useEffect(() => {
    if (typeof window !== "undefined") {
      import("bootstrap/dist/js/bootstrap.bundle.min.js");
    }
  }, []);
  

  return (
    <div className="col-md-12 col-sm-12 col-xs-12 col-lg-12">
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid display-flex">
          <div className="col-md-1 col-sm-1 col-xs-1 col-lg-1">
            <a className="" href="#">
              <svg width="50" height="50" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg" className="border-radius-px-140">
                <defs>
                  <linearGradient id="jaGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#7fe9e5ff" />   {/* Red */}
                    <stop offset="25%" stopColor="#91b7e7ff" />  {/* Orange */}
                    <stop offset="50%" stopColor="#9d7bddff" />  {/* Yellow */}
                    <stop offset="75%" stopColor="#de7ac5ff" />  {/* Green */}
                    <stop offset="100%" stopColor="#88c1dfff" /> {/* Blue */}
                  </linearGradient>
                </defs>
                <rect width="300" height="300" rx="40" fill="url(#jaGradient)"  />
                <text
                  x="50%"
                  y="55%"
                  dominantBaseline="middle"
                  textAnchor="middle"
                  fontSize="150"
                  fill="white"
                  fontFamily="Arial"
                  fontWeight="bold"
                >
                  JA
                </text>
              </svg>
            </a>
          </div>
          <div className="col-md-11 col-sm-11 col-xs-11 col-lg-11">
            <ul className="nav nav-underline">
              {navList.map((item, index) => (
                <li key={index} className="nav-item">
                  <Link 
                    className={`nav-link text-black ${item.isActive && mounted ? 'active' : ''}`}  
                    href={item.href}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}
