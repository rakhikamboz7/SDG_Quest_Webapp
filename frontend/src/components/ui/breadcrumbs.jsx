"use client"

import { ChevronRight, Home } from "lucide-react"

export const Breadcrumb = ({ items }) => {
  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
      <Home size={16} className="text-gray-400" />
      <ChevronRight size={14} className="text-gray-400" />

      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-2">
          {index > 0 && <ChevronRight size={14} className="text-gray-400" />}
          <span className={`${item.active ? "text-teal-600 font-medium" : "text-gray-600 hover:text-gray-900"}`}>
            {item.label}
          </span>
        </div>
      ))}
    </nav>
  )
}
