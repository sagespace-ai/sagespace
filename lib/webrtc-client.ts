/**
 * WebRTC Client for Live Streaming
 * Handles peer connections, media streams, and RTMP forwarding
 */

export class WebRTCClient {
  private peerConnection: RTCPeerConnection | null = null
  private localStream: MediaStream | null = null
  private remoteStream: MediaStream | null = null

  async initializeStream(constraints: MediaStreamConstraints = { video: true, audio: true }) {
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia(constraints)
      return this.localStream
    } catch (error) {
      console.error('[v0] Failed to get user media:', error)
      throw error
    }
  }

  async startScreenShare() {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({ 
        video: true, 
        audio: false 
      })
      return screenStream
    } catch (error) {
      console.error('[v0] Failed to start screen share:', error)
      throw error
    }
  }

  async createPeerConnection(configuration: RTCConfiguration) {
    this.peerConnection = new RTCPeerConnection(configuration)
    
    // Add local tracks to peer connection
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => {
        this.peerConnection?.addTrack(track, this.localStream!)
      })
    }

    return this.peerConnection
  }

  async createOffer() {
    if (!this.peerConnection) {
      throw new Error('Peer connection not initialized')
    }
    
    const offer = await this.peerConnection.createOffer()
    await this.peerConnection.setLocalDescription(offer)
    return offer
  }

  async handleAnswer(answer: RTCSessionDescriptionInit) {
    if (!this.peerConnection) {
      throw new Error('Peer connection not initialized')
    }
    
    await this.peerConnection.setRemoteDescription(new RTCSessionDescription(answer))
  }

  toggleVideo(enabled: boolean) {
    if (this.localStream) {
      const videoTrack = this.localStream.getVideoTracks()[0]
      if (videoTrack) {
        videoTrack.enabled = enabled
      }
    }
  }

  toggleAudio(enabled: boolean) {
    if (this.localStream) {
      const audioTrack = this.localStream.getAudioTracks()[0]
      if (audioTrack) {
        audioTrack.enabled = enabled
      }
    }
  }

  cleanup() {
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop())
    }
    if (this.peerConnection) {
      this.peerConnection.close()
    }
  }
}

/**
 * RTMP Streaming Configuration
 * Manages multi-platform streaming endpoints
 */
export interface RTMPEndpoint {
  platform: 'instagram' | 'tiktok' | 'youtube' | 'twitch' | 'sagespace'
  url: string
  streamKey: string
  enabled: boolean
}

export class RTMPManager {
  private endpoints: RTMPEndpoint[] = []

  addEndpoint(endpoint: RTMPEndpoint) {
    this.endpoints.push(endpoint)
  }

  removeEndpoint(platform: string) {
    this.endpoints = this.endpoints.filter(e => e.platform !== platform)
  }

  getActiveEndpoints() {
    return this.endpoints.filter(e => e.enabled)
  }

  async startMultiStream(stream: MediaStream) {
    console.log('[v0] Starting multi-stream to platforms:', this.getActiveEndpoints())
    // In production, this would forward the WebRTC stream to RTMP servers
    // For now, we log the configuration
  }
}
