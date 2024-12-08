import { useEffect, useState, useRef } from 'react'
import { listenToData } from './firebaseConfig'

export default function App() {
  const [showCamera, setShowCamera] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    listenToData('/Sensor/movimento', (cameraState) => {
      if (cameraState !== null) {
        setShowCamera(cameraState)
        if (cameraState) {
          startCamera()
        } else {
          stopCamera()
        }

        // Cancelar qualquer timer
        if (timerRef.current) {
          clearTimeout(timerRef.current)
        }

        // Timer de 10 segundos para manter a câmera aberta
        timerRef.current = setTimeout(() => {
          setShowCamera(false)
          stopCamera()
        }, 10000)
      }
    })

    return () => {
      console.log("Cleanup: Parando de escutar dados do Firebase")
      stopCamera() // Cleanup: parar a câmera se necessário

      // Clear the timer on unmount
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [])

  // Função para iniciar a câmera
  const startCamera = async () => {
    try {
      const constraints = { video: { facingMode: "user" } }
      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play() // Garantir que o vídeo seja iniciado
      }
    } catch (error) {
      console.error("Erro ao acessar a câmera:", error)
    }
  }

  // Função para parar a câmera
  const stopCamera = () => {
    const stream = videoRef.current?.srcObject as MediaStream
    const tracks = stream?.getTracks()
    tracks?.forEach((track) => track.stop())
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
  }

  return (
    <div
      style={{
        backgroundColor: 'black',
        height: '100vh',
        width: '100vw',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
      }}
    >
      {showCamera ? (
        <video
          ref={videoRef}
          style={{ width: '100%', height: '100%' }}
          autoPlay
          playsInline // Adicionado para suportar iPhones
        />
      ) : (
        <div
          style={{
            width: '50px',
            height: '50px',
            border: '6px solid #ffffff', // Cor do círculo
            borderTop: '6px solid #0d2a3d', // Cor do loader
            borderRadius: '50%',
            marginTop: '20px',
            animation: 'spin 1s linear infinite', // Animação de rotação
          }}
        />
      )}
    </div>
  )
}

// CSS para a animação de rotação
const styles = document.createElement('style')
styles.innerHTML = `
  @keyframes spin {
    0% { transform: rotate(0deg) }
    100% { transform: rotate(360deg) }
  }
`
document.head.appendChild(styles)
