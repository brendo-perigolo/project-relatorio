import { Component } from "@angular/core";
import { Routes } from "@angular/router";
import { SignaturePadComponent } from "./components/signature-pad/signature-pad.component";

export const routes: Routes = [{ path: "complete", component: SignaturePadComponent }];
