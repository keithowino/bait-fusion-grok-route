import './App.css'
import { Components } from './constants'
import { Route, Routes } from 'react-router-dom'

function App() {

  return (
    <div className="app">
      <Components.Header />
      <Routes>
        <Route path='/' element={<Components.Home />} />
        <Route path="/login" element={<Components.Login />} />
        <Route path="/signup" element={<Components.Signup />} />
        <Route path="/courses" element={<Components.Courses />} />
        <Route path="/courses/:id" element={<Components.CourseDetails />} />
        <Route path="/author-dashboard" element={
          <Components.RequireAuth>
            <Components.AuthorDashboard />
          </Components.RequireAuth>
        } />
        {/* <Route path="/author-dashboard" element={<Components.AuthorDashboard />} /> */}
        <Route path="/about" element={<Components.About />} />
        <Route path="/contact" element={<Components.Contact />} />
      </Routes>
      <Components.Footer />
    </div>
  )
}

export default App