import { ID } from '../entities/Entity'
import Blog from '../entities/Blog'

export default interface BlogRepository {
  persist(domainEntity: Blog, user_id: any): Promise<Blog | null>

  merge(domainEntity: Blog, user_id: any): Promise<Blog | null>

  remove(entityId: ID): Promise<boolean | null>

  get(entityId: ID): Promise<Blog | null>

  find(): Promise<Blog[]>
}
