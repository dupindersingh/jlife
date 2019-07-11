
import React from 'react'
import {
  InternalLink,
} from '../../styles/links'

const CenteredDiv = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: 100,
}

const ComingSoon = () => (
  <div style={CenteredDiv}>
    <h1>Whoops</h1>
    <p>This feature is coming soon. Stay tuned!</p>
    <InternalLink to="/menu">Go to the homepage</InternalLink>
  </div>
)

export default ComingSoon