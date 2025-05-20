'use client'

import { useState } from 'react'

interface DeleteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userName: string;
  userEmail: string;
  isDeleting: boolean;
}

export default function DeleteUserModal({
  isOpen,
  onClose,
  onConfirm,
  userName,
  userEmail,
  isDeleting
}: DeleteUserModalProps) {
  // Se o modal não estiver aberto, não renderizar nada
  if (!isOpen) return null;

  // Fechar o modal ao clicar no background (não na caixa do modal)
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      onClick={handleOverlayClick}
    >
      <div className="bg-gray-900 rounded-lg max-w-md w-full p-6 shadow-xl" onClick={e => e.stopPropagation()}>
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 text-red-600 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-1">Excluir usuário</h3>
          <p className="text-gray-400">
            Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita.
          </p>
        </div>
        
        <div className="bg-gray-800/50 p-4 rounded mb-6 text-sm">
          <p className="mb-1"><span className="text-gray-400">Nome:</span> {userName}</p>
          <p><span className="text-gray-400">Email:</span> {userEmail}</p>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50 flex items-center"
          >
            {isDeleting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Excluindo...
              </>
            ) : (
              'Excluir Usuário'
            )}
          </button>
        </div>
      </div>
    </div>
  );
} 