const codes = {
  roles: {
    owner: '1200A',
    Dev: '1200O',
    Admin: '1200',
    employee: '1111',
    supplier: '1100',
    client: '1000',
  },
  permissions: {
    users: {
      all: '0010',
      create: '0011',
      read: '0012',
      update: '0013',
      delete: '0014',
    },
    tasks: {
      all: '0020',
      create: '0021',
      read: '0022',
      update: '0023',
      delete: '0024',
    },
    clients: {
      all: '0030',
      create: '0031',
      read: '0032',
      update: '0033',
      delete: '0034',
    },
    services: {
      all: '0040',
      create: '0041',
      read: '0042',
      update: '0043',
      delete: '0044',
    },
    toDoAndWorks: {
      all: '0050',
      create: '0051',
      read: '0052',
      update: '0053',
      delete: '0054',
    },
  },
  // dunction
  AllRoles() {
    return [
      this.roles.owner,
      this.roles.Dev,
      this.roles.Admin,
      this.roles.employee,
      this.roles.supplier,
      this.roles.client,
    ];
  },
  onlyOrganization() {
    return [
      this.roles.owner,
      this.roles.Dev,
      this.roles.Admin,
      this.roles.employee,
      this.roles.supplier,
    ];
  },
  maxRange() {
    return [
      this.roles.owner,
      this.roles.Dev,
      this.roles.Admin,
    ];
  },
};

module.exports = { codes };
