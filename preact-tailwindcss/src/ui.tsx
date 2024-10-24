import { render } from '@create-figma-plugin/ui'
import { h } from 'preact'
import '!./output.css'
import { AuthButton } from './components/AuthButton'
import { Profile } from './components/Profile'

function Plugin () {
  return (
    <div className="p-10">
      <AuthButton />
      <Profile />
    </div>
  )
}

export default render(Plugin)
