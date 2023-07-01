import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import JoinForm from '../components/JoinForm'

const Home = () => {
  return (
    <React.Fragment>
        <Navbar />
        <main className="w-100 flex center">
            <h1 className="mb-3">Welcome to GPTz</h1>
            <JoinForm />
        </main>
        <Footer />
    </React.Fragment>
  )
}

export default Home
