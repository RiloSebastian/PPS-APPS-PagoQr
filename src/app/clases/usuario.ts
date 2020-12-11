export class Usuario {
  public id;
  public correo;
  public clave;
  public perfil;
  public sexo;

  constructor(id, correo, clave, perfil, sexo) {
    
    this.id = id;
    this.correo = correo;
    this.clave = clave;
    this.perfil = perfil;
    this.sexo = sexo;
  }
}
