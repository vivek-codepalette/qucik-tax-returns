'use client'

import { useEffect, useRef } from 'react'
import SignaturePadLib from 'signature_pad'

interface SignatureCanvasProps {
  onChange: (signature: string) => void
  onClear: () => void
}

export function SignatureCanvas({ onChange }: SignatureCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const signaturePadRef = useRef<SignaturePadLib | null>(null)

  useEffect(() => {
    if (canvasRef.current) {
      signaturePadRef.current = new SignaturePadLib(canvasRef.current, {
        backgroundColor: 'rgb(255, 255, 255)',
        penColor: 'rgb(0, 0, 0)'
      })

      const canvas = canvasRef.current
      const ratio = Math.max(window.devicePixelRatio || 1, 1)
      canvas.width = canvas.offsetWidth * ratio
      canvas.height = canvas.offsetHeight * ratio
      canvas.getContext('2d')?.scale(ratio, ratio)
      
      signaturePadRef.current.clear()
      onChange('')
    }

    return () => {
      if (signaturePadRef.current) {
        signaturePadRef.current.off()
      }
    }
  }, [onChange])

  useEffect(() => {
    if (signaturePadRef.current) {
    //   signaturePadRef.current.onEnd = () => {
    //     const signature = signaturePadRef.current?.toDataURL() || ''
    //     onChange(signature)
    //   }
    }
  }, [])

//   const handleClear = () => {
//     if (signaturePadRef.current) {
//       signaturePadRef.current.clear()
//       onClear()
//     }
//   }

  return (
    <div className="space-y-4">
      <canvas
        ref={canvasRef}
        className="border rounded-lg w-full h-48 touch-none"
      />
    </div>
  )
} 