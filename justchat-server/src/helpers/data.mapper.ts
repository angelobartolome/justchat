export interface DataMapper<E, D> {
  fromDomain(domain: D): E;
  toDomain(entity: E): D;
}
