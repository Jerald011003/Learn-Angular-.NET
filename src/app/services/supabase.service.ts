import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabase: SupabaseClient;
  private authStatus = new BehaviorSubject<boolean>(false);
  private supabaseUrl = environment.supabaseUrl;
  private supabaseKey = environment.supabaseKey;

  constructor() {
    if (environment.supabaseUrl && environment.supabaseKey) {
      this.supabase = createClient(this.supabaseUrl, this.supabaseKey);
      this.supabase.auth.onAuthStateChange((event, session) => {
        this.authStatus.next(!!session);
      });
    } else {
      console.error('Supabase URL and Key are missing');
      throw new Error('Supabase credentials not configured.');
    }
  }
  

  signIn(email: string, password: string) {
    return this.supabase.auth.signInWithPassword({ email, password });
  }

  async signOut() {
    await this.supabase.auth.signOut();
    this.authStatus.next(false);
  }

  getUser () {
    return this.supabase.auth.getSession();
  }

  isAuthenticated() {
    return this.authStatus.asObservable();
  }
}