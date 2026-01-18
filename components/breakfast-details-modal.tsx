"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import type { BreakfastComplex } from "@/lib/breakfast-data"
import { Button } from "@/components/ui/button"

interface BreakfastDetailsModalProps {
  complex: BreakfastComplex | null
  isOpen: boolean
  onClose: () => void
}

export function BreakfastDetailsModal({ complex, isOpen, onClose }: BreakfastDetailsModalProps) {
  if (!complex) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 z-50 flex items-end"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="w-full bg-card rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-foreground">{complex.name}</h2>
              <Button
                onClick={onClose}
                variant="ghost"
                className="p-2 h-auto text-foreground hover:text-primary"
              >
                <X className="w-6 h-6" />
              </Button>
            </div>

            <div className="space-y-6">
              <div>
                <p className="text-muted-foreground mb-4">{complex.description}</p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-3">Входит в комплекс:</h3>
                <ul className="space-y-2">
                  {complex.items.map((item, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                      <span className="text-foreground text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-background rounded-xl p-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Цена</span>
                  <span className="text-2xl font-semibold text-primary">{complex.price} ₽</span>
                </div>
              </div>

              <Button
                onClick={onClose}
                className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Понятно
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
