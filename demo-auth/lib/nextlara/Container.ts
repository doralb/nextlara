type ServiceFactory = () => any;

class ServiceContainer {
  private services: Map<string, ServiceFactory> = new Map();
  private singletons: Map<string, any> = new Map();

  bind(name: string, factory: ServiceFactory) {
    this.services.set(name, factory);
  }

  singleton(name: string, factory: ServiceFactory) {
    this.services.set(name, factory);
    this.singletons.set(name, null);
  }

  make<T = any>(name: string): T {
    if (this.singletons.has(name)) {
      let instance = this.singletons.get(name);
      if (!instance) {
        const factory = this.services.get(name);
        if (!factory) throw new Error(`Service ${name} not found`);
        instance = factory();
        this.singletons.set(name, instance);
      }
      return instance;
    }

    const factory = this.services.get(name);
    if (!factory) throw new Error(`Service ${name} not found`);
    return factory();
  }
}

export const container = new ServiceContainer();
