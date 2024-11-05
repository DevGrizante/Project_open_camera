import { useEffect, useState, useRef } from 'react'

export default function App() {
  const [showCamera, setShowCamera] = useState(false)
  const videoRef = useRef(null)

  useEffect(() => {
    // Alterna entre mostrar a câmera e o carregamento a cada 5 segundos
    const interval = setInterval(() => {
      setShowCamera(prevState => !prevState)  // Alterna o estado
    }, 5000)  // 5 segundos

    return () => clearInterval(interval); // Limpa o intervalo ao desmontar
  }, [])

  return (
    <div style={{ 
      backgroundColor: 'black', 
      height: '100vh', 
      width: '100vw',  
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      flexDirection: 'column'
    }}>
      {showCamera ? (
        <video ref={videoRef} style={{ width: '100%', height: '100%' }} />
      ) : (
        <>
          <div style={{
            width: '50px',
            height: '50px',
            border: '6px solid #ffffff',  // Cor do círculo
            borderTop: '6px solid #0d2a3d',  // Cor do loader
            borderRadius: '50%',
            marginTop: '20px',
            animation: 'spin 1s linear infinite'  // Animação de rotação
          }} />
        </>
      )}
    </div>
  )
}
// CSS para a animação de rotação
const styles = document.createElement("style");
styles.innerHTML = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`
document.head.appendChild(styles)



