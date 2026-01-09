import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
import { Dashboard } from './pages/Dashboard'
import { Subjects } from './pages/Subjects'
import { TopicViewer } from './pages/TopicViewer'
import { CourseView } from './pages/CourseView'
import { VideoPlayer } from './pages/VideoPlayer'
import { Settings } from './pages/Settings'
import { InstallPrompt } from './components/InstallPrompt'
import './index.css'

function App() {
  return (
    <BrowserRouter>
      <InstallPrompt />
      <AppShell>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/subjects" element={<Subjects />} />
          <Route path="/course/:courseId" element={<CourseView />} />
          <Route path="/watch/:courseId/:instructorId/:videoId" element={<VideoPlayer />} />
          <Route path="/topic/:subjectId/:topicId" element={<TopicViewer />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </AppShell>
    </BrowserRouter>
  )
}

export default App

