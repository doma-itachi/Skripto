import Versions from './components/Versions'
import electronLogo from './assets/electron.svg'
import BackgroundImage from "./assets/background.jpg"
import Home from './components/Home'
import Sidebar from './components/Sidebar'
import { useAtom } from 'jotai'
import { pageAtom } from './lib/atoms'
import Settings from './components/Settings'
import { motion, AnimatePresence } from 'framer-motion'

function App(): JSX.Element {
  const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')
  const [ page, setPage ] = useAtom(pageAtom);

  return (
    <div className="bg-background bg-right h-dvh bg-cover overflow-hidden flex">
        {/* サイドバー */}
        <div className="w-52 backdrop-blur-sm flex flex-col py-4">
            <Sidebar></Sidebar>
        </div>

        {/* コンテンツ */}
        <div className="grow bg-neutral-900/80 backdrop-blur py-4 flex">
            <AnimatePresence mode='wait'>
                {
                    <motion.div
                        key={page}
                        initial={{ opacity: 0, y: 100 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 100 }}
                        className='w-full flex flex-col'
                    >
                        {
                            page==="home"?<Home></Home>:<Settings></Settings>
                        }
                    </motion.div>
                }
            </AnimatePresence>
        </div>
    </div>
  )
}

export default App
