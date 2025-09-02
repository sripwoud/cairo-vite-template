import { createLazyFileRoute } from '@tanstack/react-router'
// import { LoadingSpinner } from 'c/LoadingSpinner'
// import { useProof } from 'h/useProof'
// import { useState } from 'react'

export const Route = createLazyFileRoute('/verify')({
  component: () => <>TODO</>,
})

// function VerifyPage() {
//   const { verifyProof, isVerifying } = useProof()
//   const [selectedFile, setSelectedFile] = useState<File | null>(null)
//   const [verificationResult, setVerificationResult] = useState<boolean | null>(
//     null,
//   )
//   const [error, setError] = useState<string | null>(null)

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0]
//     if (file && file.type === 'application/json') {
//       setSelectedFile(file)
//       setVerificationResult(null)
//     } else {
//       alert('Please select a valid JSON file')
//       e.target.value = ''
//     }
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()

//     if (!selectedFile || isVerifying) return

//     try {
//       // Read and parse the JSON file
//       const fileContent = await selectedFile.text()
//       const proofData = JSON.parse(fileContent)

//       // TODO: Validate JSON structure
//       // For now, we'll assume it has proof and publicInputs fields

//       // Convert proof from hex or array format
//       let proofBytes: Uint8Array
//       if (typeof proofData.proof === 'string') {
//         // Handle hex string
//         const proofHex = proofData.proof.replace(/^0x/, '').replace(/\s/g, '')
//         proofBytes = new Uint8Array(
//           proofHex.match(/.{1,2}/g)?.map((byte: string) => Number.parseInt(byte, 16))
//             || [],
//         )
//       } else if (Array.isArray(proofData.proof)) {
//         // Handle array format
//         proofBytes = new Uint8Array(proofData.proof)
//       } else {
//         throw new Error('Invalid proof format')
//       }

//       const result = await verifyProof(proofBytes, proofData.publicInputs)
//       if (result.isOk()) {
//         setVerificationResult(result.inner)
//         setError(null)
//       } else {
//         setError(result.inner)
//         setVerificationResult(false)
//       }
//     } catch (err) {
//       console.error('Verification error:', err)
//       setError(err instanceof Error ? err.message : 'Unknown error')
//       setVerificationResult(false)
//     }
//   }

//   return (
//     <div className='container mx-auto max-w-md p-4'>
//       <h1 className='text-2xl font-bold mb-6'>Verify Proof</h1>

//       <form className='space-y-4' onSubmit={handleSubmit}>
//         <div>
//           <label
//             className='block text-sm font-medium mb-2'
//             htmlFor='proof-file'
//           >
//             Proof JSON File
//           </label>
//           <input
//             accept='.json,application/json'
//             className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100'
//             disabled={isVerifying}
//             id='proof-file'
//             onChange={handleFileChange}
//             required
//             type='file'
//           />
//           <p className='mt-1 text-sm text-gray-500'>
//             Upload a JSON file containing proof and publicInputs
//           </p>
//         </div>

//         {selectedFile && (
//           <div className='text-sm text-gray-600'>
//             Selected: {selectedFile.name}
//           </div>
//         )}

//         <button
//           className='w-full py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed'
//           disabled={!selectedFile || isVerifying}
//           type='submit'
//         >
//           {isVerifying
//             ? (
//               <div className='flex items-center justify-center gap-2'>
//                 <LoadingSpinner
//                   color='#ffffff'
//                   isLoading={true}
//                   message=''
//                   size={16}
//                 />
//                 Verifying...
//               </div>
//             )
//             : (
//               'Verify Proof'
//             )}
//         </button>
//       </form>

//       {error && (
//         <div className='mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded'>
//           {error}
//         </div>
//       )}

//       {verificationResult !== null && (
//         <div
//           className={`mt-4 p-3 rounded border ${
//             verificationResult
//               ? 'bg-green-100 border-green-400 text-green-700'
//               : 'bg-red-100 border-red-400 text-red-700'
//           }`}
//         >
//           {verificationResult
//             ? '✅ Proof is valid!'
//             : '❌ Proof verification failed.'}
//         </div>
//       )}
//     </div>
//   )
// }
