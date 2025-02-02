/**
 * @license
 * Copyright 2019 Ludan Stoecklé
 * SPDX-License-Identifier: Apache-2.0
 */

import { readFileSync } from 'fs';
import { Adjectives, Nouns, PastParticiples } from './create/createDb';

export class MorphItHelper {
  private adjectives: Adjectives | null = null;
  private nouns: Nouns | null = null;
  private pastParticiples: PastParticiples | null = null;

  public isAdj(flexform: string): boolean {
    return this.getAdj(flexform) != null;
  }
  public isNoun(flexform: string): boolean {
    return this.getNoun(flexform) != null;
  }

  public getNoun(param: string): string {
    if (!this.nouns) {
      this.nouns = JSON.parse(readFileSync(__dirname + '/../resources_pub/nouns.json', 'utf8'));
    }

    return (this.nouns as Nouns)[param];
  }

  public getAdj(param: string): string | undefined {
    if (!this.adjectives) {
      this.adjectives = JSON.parse(readFileSync(__dirname + '/../resources_pub/adjectives.json', 'utf8'));
    }
    const adjectiveInfo = (this.adjectives as Adjectives)[param];
    if (!adjectiveInfo) {
      return undefined;
    }

    const lemma: string = adjectiveInfo[0];
    const isPp: boolean = adjectiveInfo[1];
    if (isPp) {
      /*
        educato	educare	VER:part+past+s+m
        educati	educare	VER:part+past+p+m
        educata	educare	VER:part+past+s+f
      */
      if (!this.pastParticiples) {
        this.pastParticiples = JSON.parse(readFileSync(__dirname + '/../resources_pub/pastParticiples.json', 'utf8'));
      }
      return (this.pastParticiples as PastParticiples)[lemma];
    } else {
      // all good
      return lemma;
    }
  }
}
