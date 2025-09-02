import { None, type Option } from '@hazae41/option'
import type { Result } from '@hazae41/result'
import type { CircuitClient, ProofResult } from 'circuit'
import { atom } from 'jotai'

export const circuitInitAtom = atom<Option<Result<void, string>>>(new None())
export const circuitClientAtom = atom<Option<CircuitClient>>(new None())
export const initPromiseAtom = atom<Option<Promise<Result<CircuitClient, string>>>>(new None())
export const proofGenerationAtom = atom<Option<Result<ProofResult, string>>>(new None())
export const proofVerificationAtom = atom<Option<Result<boolean, string>>>(new None())

export const isInitializingAtom = atom<boolean>(false)
export const isGeneratingAtom = atom<boolean>(false)
export const isVerifyingAtom = atom<boolean>(false)

export const ageAtom = atom<string>('')
