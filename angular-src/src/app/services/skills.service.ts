
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import {HttpClientModule} from '@angular/common/http';
import { Skills } from './skill.model';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class SkillsService {
  private Skills: Skills[] = [];
  private SkillsUpdated = new Subject<Skills[]>();

  constructor(private http: HttpClient , private router: Router) {}
  getSkills() {
    this.http
      .get<{ message: string; skills: any }>(
        'http://localhost:3000/skills'
      )
      .pipe(map((postData) => {
        return postData.skills.map(skill => {
          return {
            skill_name: skill.skill_name,
            sub_skills:skill.sub_skills,

            id: skill._id
          };
        });
      }))
      .subscribe(transformedSkills => {
        this.Skills = transformedSkills;
        this.SkillsUpdated.next([...this.Skills]);
      });
  }

  getPostUpdateListener() {
    return this.SkillsUpdated.asObservable();
  }
  getPost(id: string) {
    return {...this.Skills.find(p =>p.id ===id)};
  }

  addPost(skill_name: string,sub_skills:[]
    ) {
    const skills: Skills = { 
      id: null,
      skill_name: skill_name,
      sub_skills:sub_skills


       };
    this.http
      .post<{ message: string }>('http://localhost:3000/skills', skills)
      .subscribe(responseData => {
        console.log(responseData.message);
        this.Skills.push(skills);
        this.SkillsUpdated.next([...this.Skills]);
      });
  }
  

  
}
