export interface User {
  id: string
  email: string
  name: string
  role: 'project_owner' | 'contributor' | 'admin' | 'visitor'
}
